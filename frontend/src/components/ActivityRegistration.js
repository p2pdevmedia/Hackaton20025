import { useCallback, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';

const USDT_ABI = [
  'function decimals() view returns (uint8)',
  'function transfer(address to, uint256 value) returns (bool)',
  'function balanceOf(address account) view returns (uint256)'
];

function ActivityRegistration({ activity, account, getProvider, onRequestConnect, text }) {
  const [quantity, setQuantity] = useState(1);
  const [decimals, setDecimals] = useState(6);
  const [isLoadingDecimals, setIsLoadingDecimals] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const usdtAddress = process.env.REACT_APP_USDT_ADDRESS;
  const destinationWallet = process.env.REACT_APP_DESTINATION_WALLET;

  const agendaText = text?.agenda || {};
  const statusText = text?.status || {};
  const warningsText = text?.warnings || {};

  const normalizedUsdtAddress = useMemo(() => {
    if (!usdtAddress) {
      return null;
    }
    try {
      return ethers.utils.getAddress(usdtAddress);
    } catch (error) {
      console.warn('Invalid USDT token address configured', error);
      return null;
    }
  }, [usdtAddress]);

  const normalizedDestinationWallet = useMemo(() => {
    if (!destinationWallet) {
      return null;
    }
    try {
      return ethers.utils.getAddress(destinationWallet);
    } catch (error) {
      console.warn('Invalid destination wallet configured', error);
      return null;
    }
  }, [destinationWallet]);

  const hasPaymentConfig = Boolean(normalizedUsdtAddress && normalizedDestinationWallet);

  const destinationWarning = warningsText.destination;
  const usdtWarning = warningsText.usdt;

  const paymentConfigurationIssue = useMemo(() => {
    if (!destinationWallet) {
      return destinationWarning || 'Set the destination wallet environment variable to enable registrations.';
    }

    if (!normalizedDestinationWallet) {
      return warningsText.invalidDestination || 'The configured destination wallet address is invalid.';
    }

    if (!usdtAddress) {
      return usdtWarning || 'Set the USDT token address environment variable to enable registrations.';
    }

    if (!normalizedUsdtAddress) {
      return warningsText.invalidUsdt || 'The configured USDT token address is invalid.';
    }

    return null;
  }, [
    destinationWallet,
    destinationWarning,
    normalizedDestinationWallet,
    normalizedUsdtAddress,
    usdtAddress,
    usdtWarning,
    warningsText.invalidDestination,
    warningsText.invalidUsdt
  ]);

  const missingPaymentConfigMessage = useMemo(() => {
    if (!paymentConfigurationIssue) {
      return null;
    }
    return paymentConfigurationIssue;
  }, [paymentConfigurationIssue]);

  useEffect(() => {
    let cancelled = false;

    const loadDecimals = async () => {
      if (!account || !normalizedUsdtAddress) {
        return;
      }

      const provider = getProvider?.();
      if (!provider) {
        return;
      }

      setIsLoadingDecimals(true);
      try {
        const contract = new ethers.Contract(normalizedUsdtAddress, USDT_ABI, provider);
        const value = await contract.decimals();
        const resolved = typeof value === 'number' ? value : Number(value);
        if (!cancelled && Number.isFinite(resolved)) {
          setDecimals(resolved);
        }
      } catch (error) {
        console.error('Could not read USDT decimals', error);
        // Default to 6 decimals when decimals() is unavailable.
        if (!cancelled) {
          setDecimals(6);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingDecimals(false);
        }
      }
    };

    loadDecimals();

    return () => {
      cancelled = true;
    };
  }, [account, getProvider, normalizedUsdtAddress]);

  const unitPriceLabel = useMemo(() => {
    if (!activity?.priceUSDT) {
      return null;
    }
    return `${Number(activity.priceUSDT).toFixed(2)} USDT`;
  }, [activity?.priceUSDT]);

  const totalPriceLabel = useMemo(() => {
    const total = (Number(activity?.priceUSDT || 0) * quantity).toFixed(2);
    return `${total} USDT`;
  }, [activity?.priceUSDT, quantity]);

  const handleQuantityChange = useCallback(event => {
    const value = Number(event.target.value);
    if (Number.isNaN(value) || value < 1) {
      setQuantity(1);
      return;
    }
    setQuantity(Math.min(value, 50));
  }, []);

  const handlePayment = useCallback(async () => {
    if (!activity || !activity.priceUSDT) {
      return;
    }

    if (!hasPaymentConfig) {
      setStatusMessage(
        missingPaymentConfigMessage ||
          statusText.destinationMissing ||
          'Payment configuration is missing.'
      );
      return;
    }

    if (!normalizedDestinationWallet || !normalizedUsdtAddress) {
      setStatusMessage(
        missingPaymentConfigMessage ||
          statusText.destinationMissing ||
          'Payment configuration is missing.'
      );
      return;
    }

    const provider = getProvider?.();
    if (!provider) {
      setStatusMessage(statusText.destinationMissing || 'Wallet provider unavailable.');
      return;
    }

    let activeAccount = account;

    if (!activeAccount && typeof onRequestConnect === 'function') {
      try {
        setStatusMessage(statusText.connectingWallet || 'Connecting your wallet...');
        await onRequestConnect();
        const accounts = await provider.listAccounts();
        if (accounts.length) {
          activeAccount = ethers.utils.getAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Wallet connection failed', error);
        setStatusMessage(statusText.connectionFailed || 'Wallet connection was cancelled or failed.');
        return;
      }
    }

    if (!activeAccount) {
      setStatusMessage(statusText.connectWalletToRegister || 'Connect your wallet to continue.');
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage(statusText.requestingSignature || 'Review the transaction in your wallet.');

      const signer = provider.getSigner();
      const contract = new ethers.Contract(normalizedUsdtAddress, USDT_ABI, signer);

      const total = (Number(activity.priceUSDT) * quantity).toFixed(2);
      const amount = ethers.utils.parseUnits(total, decimals);

      const balance = await contract.balanceOf(activeAccount);
      if (balance.lt(amount)) {
        setStatusMessage(
          statusText.insufficientBalance || 'Your USDT balance is not sufficient to cover this registration.'
        );
        return;
      }

      const tx = await contract.transfer(normalizedDestinationWallet, amount);
      setStatusMessage(statusText.confirmingOnChain || 'Waiting for on-chain confirmation...');
      await tx.wait();
      setStatusMessage(statusText.registrationComplete || 'Payment completed successfully!');
    } catch (error) {
      console.error('USDT payment failed', error);
      setStatusMessage(statusText.registrationFailed || 'Payment could not be completed.');
    } finally {
      setIsProcessing(false);
    }
  }, [
    activity,
    decimals,
    getProvider,
    hasPaymentConfig,
    account,
    quantity,
    statusText,
    missingPaymentConfigMessage,
    normalizedDestinationWallet,
    normalizedUsdtAddress,
    onRequestConnect
  ]);

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div>
            <label htmlFor={`${activity.id}-quantity`} className="text-sm font-medium text-slate-900">
              {agendaText.participantCountLabel || 'Participants'}
            </label>
            <p className="text-xs text-slate-500">
              {agendaText.participantCountHelper || 'Choose how many seats to reserve.'}
            </p>
            {activity?.maxParticipants && (
              <p className="text-xs text-slate-500">
                {(agendaText.spotsLabel || 'Spots').concat(': ')}
                {activity.maxParticipants}
              </p>
            )}
          </div>
          <input
            id={`${activity.id}-quantity`}
            type="number"
            min={1}
            max={50}
            value={quantity}
            onChange={handleQuantityChange}
            className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>
        <div className="space-y-1 text-right">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {agendaText.priceLabel || 'Contribution'}
          </p>
          <p className="text-lg font-semibold text-slate-900">{totalPriceLabel}</p>
          {unitPriceLabel && (
            <p className="text-xs text-slate-500">
              {unitPriceLabel} · {agendaText.participantCountLabel || 'Participants'}
            </p>
          )}
          {isLoadingDecimals && (
            <p className="text-xs text-slate-500">Loading token details…</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={handlePayment}
        disabled={isProcessing}
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isProcessing
          ? statusText.processingRegistration || 'Processing...'
          : agendaText.subscribeButton || 'Send registration'}
      </button>
      {statusMessage && (
        <p className="mt-3 text-sm text-slate-600" role="status">
          {statusMessage}
        </p>
      )}
    </div>
  );
}

export default ActivityRegistration;
