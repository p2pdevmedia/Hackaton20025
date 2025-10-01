import { useCallback, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';

const ERC20_ABI = [
  'function decimals() view returns (uint8)',
  'function transfer(address to, uint256 value) returns (bool)',
  'function balanceOf(address account) view returns (uint256)'
];

function ActivityRegistration({
  activity,
  account,
  getProvider,
  text,
  participantInfo,
  onRegistrationDetails
}) {
  const [quantity, setQuantity] = useState(1);
  const [decimals, setDecimals] = useState(6);
  const [isLoadingDecimals, setIsLoadingDecimals] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState('USDT');

  const usdtAddress = process.env.REACT_APP_USDT_ADDRESS;
  const usdcAddress = process.env.REACT_APP_USDC_ADDRESS || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  const destinationWallet = process.env.REACT_APP_DESTINATION_WALLET;

  const agendaText = text?.agenda || {};
  const statusText = text?.status || {};
  const warningsText = text?.warnings || {};

  const tokenOptions = useMemo(() => {
    const entries = [
      {
        symbol: 'USDT',
        label: 'USDT',
        warningKey: 'usdt',
        invalidWarningKey: 'invalidUsdt',
        rawAddress: usdtAddress,
        hasFallback: false
      },
      {
        symbol: 'USDC',
        label: 'USDC',
        warningKey: 'usdc',
        invalidWarningKey: 'invalidUsdc',
        rawAddress: usdcAddress,
        hasFallback: true
      }
    ];

    return entries.map(entry => {
      const address = entry.rawAddress;
      if (!address) {
        return {
          ...entry,
          address: null,
          normalizedAddress: null,
          isConfigured: false,
          isInvalid: false
        };
      }

      try {
        const normalized = ethers.utils.getAddress(address);
        return {
          ...entry,
          address,
          normalizedAddress: normalized,
          isConfigured: true,
          isInvalid: false
        };
      } catch (error) {
        console.warn(`Invalid ${entry.symbol} token address configured`, error);
        return {
          ...entry,
          address,
          normalizedAddress: null,
          isConfigured: true,
          isInvalid: true
        };
      }
    });
  }, [usdtAddress, usdcAddress]);

  const selectedToken = useMemo(() => {
    const resolved = tokenOptions.find(option => option.symbol === selectedTokenSymbol);
    if (resolved) {
      return resolved;
    }
    return tokenOptions[0];
  }, [selectedTokenSymbol, tokenOptions]);

  useEffect(() => {
    const preferred = tokenOptions.find(option => option.symbol === selectedTokenSymbol);
    if (preferred?.normalizedAddress || !tokenOptions.length) {
      return;
    }

    const firstAvailable = tokenOptions.find(option => option.normalizedAddress);
    if (firstAvailable && firstAvailable.symbol !== selectedTokenSymbol) {
      setSelectedTokenSymbol(firstAvailable.symbol);
    }
  }, [selectedTokenSymbol, tokenOptions]);

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

  const hasPaymentConfig = useMemo(
    () => Boolean(selectedToken?.normalizedAddress && normalizedDestinationWallet),
    [normalizedDestinationWallet, selectedToken?.normalizedAddress]
  );

  const destinationWarning = warningsText.destination;
  const tokenWarning = selectedToken ? warningsText[selectedToken.warningKey] : null;

  const paymentConfigurationIssue = useMemo(() => {
    if (!destinationWallet) {
      return destinationWarning || 'Set the destination wallet environment variable to enable registrations.';
    }

    if (!normalizedDestinationWallet) {
      return warningsText.invalidDestination || 'The configured destination wallet address is invalid.';
    }

    if (!selectedToken?.address) {
      return (
        tokenWarning ||
        `Set the ${selectedToken?.symbol || 'token'} environment variable to enable registrations.`
      );
    }

    if (selectedToken?.isInvalid) {
      const invalidKey = selectedToken?.invalidWarningKey;
      const fallbackWarning = warningsText[invalidKey];
      return (
        fallbackWarning || `The configured ${selectedToken?.symbol || 'token'} address is invalid.`
      );
    }

    if (!selectedToken?.normalizedAddress) {
      return `The ${selectedToken?.symbol || 'token'} configuration is missing.`;
    }

    return null;
  }, [
    destinationWallet,
    destinationWarning,
    normalizedDestinationWallet,
    selectedToken,
    tokenWarning,
    warningsText
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
      if (!account || !selectedToken?.normalizedAddress) {
        setDecimals(6);
        return;
      }

      const provider = getProvider?.();
      if (!provider) {
        setDecimals(6);
        return;
      }

      setIsLoadingDecimals(true);
      try {
        const contractCode = await provider.getCode(selectedToken.normalizedAddress);
        if (!contractCode || contractCode === '0x') {
          throw new Error(`${selectedToken.symbol} contract code not found`);
        }
        const contract = new ethers.Contract(selectedToken.normalizedAddress, ERC20_ABI, provider);
        const value = await contract.decimals();
        const resolved = typeof value === 'number' ? value : Number(value);
        if (!cancelled && Number.isFinite(resolved)) {
          setDecimals(resolved);
        }
      } catch (error) {
        console.error(`Could not read ${selectedToken?.symbol} decimals`, error);
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
  }, [account, getProvider, selectedToken]);

  const unitPriceLabel = useMemo(() => {
    if (!activity?.priceUSDT) {
      return null;
    }
    const tokenLabel = selectedToken?.label || 'USDT';
    return `${Number(activity.priceUSDT).toFixed(2)} ${tokenLabel}`;
  }, [activity?.priceUSDT, selectedToken]);

  const totalPriceLabel = useMemo(() => {
    const total = (Number(activity?.priceUSDT || 0) * quantity).toFixed(2);
    const tokenLabel = selectedToken?.label || 'USDT';
    return `${total} ${tokenLabel}`;
  }, [activity?.priceUSDT, quantity, selectedToken]);

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

    if (!account) {
      setStatusMessage(statusText.connectWalletToRegister || 'Connect your wallet to continue.');
      return;
    }

    if (!participantInfo) {
      setStatusMessage(
        statusText.missingParticipantInfo ||
          'Complete your participant information before registering for an activity.'
      );
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

    if (!normalizedDestinationWallet || !selectedToken?.normalizedAddress) {
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

    try {
      setIsProcessing(true);
      setStatusMessage(statusText.requestingSignature || 'Review the transaction in your wallet.');

      if (onRegistrationDetails) {
        const payload = {
          wallet: account,
          participants: quantity,
          activity: {
            id: activity?.id || null,
            title: activity?.title || null
          },
          participantInfo,
          timestamp: new Date().toISOString()
        };

        try {
          await onRegistrationDetails(payload);
        } catch (error) {
          console.error('Failed to send participant information for registration', error);
        }
      }

      const signer = provider.getSigner();

      const network = await provider.getNetwork().catch(() => null);
      const contractCode = await provider.getCode(selectedToken.normalizedAddress);
      if (!contractCode || contractCode === '0x') {
        const networkLabel =
          network?.name && network.name !== 'unknown'
            ? network.name
            : network?.chainId
            ? `chain ID ${network.chainId}`
            : 'the connected network';
        const template =
          statusText.tokenUnavailable ||
          statusText.usdtUnavailable ||
          'The configured token ({address}) is not deployed on {network}.';
        const formattedMessage = template
          .replace('{network}', networkLabel)
          .replace('{address}', selectedToken.normalizedAddress)
          .replace('{token}', selectedToken.label);
        setStatusMessage(
          formattedMessage

        );
        return;
      }
      const contract = new ethers.Contract(selectedToken.normalizedAddress, ERC20_ABI, signer);

      const total = (Number(activity.priceUSDT) * quantity).toFixed(2);
      const amount = ethers.utils.parseUnits(total, decimals);

      const balance = await contract.balanceOf(account);
      if (balance.lt(amount)) {
        setStatusMessage(
          statusText.insufficientBalanceToken ||
            statusText.insufficientBalance ||
            `Your ${selectedToken.symbol} balance is not sufficient to cover this registration.`
        );
        return;
      }

      const tx = await contract.transfer(normalizedDestinationWallet, amount);
      setStatusMessage(statusText.confirmingOnChain || 'Waiting for on-chain confirmation...');
      await tx.wait();
      setStatusMessage(statusText.registrationComplete || 'Payment completed successfully!');
    } catch (error) {
      console.error(`${selectedToken?.symbol || 'Token'} payment failed`, error);
      setStatusMessage(statusText.registrationFailed || 'Payment could not be completed.');
    } finally {
      setIsProcessing(false);
    }
  }, [
    account,
    activity,
    decimals,
    getProvider,
    hasPaymentConfig,
    selectedToken,
    quantity,
    statusText,
    missingPaymentConfigMessage,
    normalizedDestinationWallet,
    participantInfo,
    onRegistrationDetails
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
      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {agendaText.paymentTokenLabel || 'Payment token'}
        </p>
        <div className="mt-2 inline-flex gap-2 rounded-xl bg-white p-1">
          {tokenOptions.map(option => (
            <button
              key={option.symbol}
              type="button"
              onClick={() => setSelectedTokenSymbol(option.symbol)}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition ${
                option.symbol === selectedToken?.symbol
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {selectedToken?.isInvalid && (
          <p className="mt-2 text-xs text-red-600">
            {warningsText[selectedToken.invalidWarningKey] ||
              `The configured ${selectedToken.symbol} address is invalid.`}
          </p>
        )}
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
