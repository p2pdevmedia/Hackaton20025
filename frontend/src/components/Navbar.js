import React from 'react';

function Navbar({
  account,
  connect,
  disconnect,
  language,
  setLanguage,
  text,
  languageLabel,
  languageOptions,
  hasParticipantInfo,
  onEditParticipantInfo
}) {
  const profileButtonLabel = text?.editProfile || 'Edit personal information';
  const profileButton =
    hasParticipantInfo && typeof onEditParticipantInfo === 'function' ? (
      <button
        type="button"
        onClick={onEditParticipantInfo}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 text-blue-600 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={profileButtonLabel}
        title={profileButtonLabel}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
          <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      </button>
    ) : null;

  return (
    <nav className="bg-white/90 backdrop-blur shadow">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-blue-600">{text.title}</h1>
          <p className="text-sm text-gray-600">{text.subtitle}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <span>{languageLabel}</span>
            <select
              value={language}
              onChange={event => setLanguage(event.target.value)}
              className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languageOptions.map(option => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {account ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              <button
                type="button"
                onClick={disconnect}
                className="px-3 py-1 rounded bg-red-500 text-white transition hover:bg-red-600"
              >
                {text.disconnect}
              </button>
              {profileButton}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={connect}
                className="px-4 py-2 rounded bg-blue-600 text-white transition hover:bg-blue-700"
              >
                {text.connect}
              </button>
              {profileButton}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
