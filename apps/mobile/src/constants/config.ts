const Config = {
  firebase: {
    // Firebase config goes in environment variables
    // This is a placeholder - user must supply their own config
  },
  pagination: {
    defaultLimit: 20,
    searchLimit: 30,
  },
  audio: {
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
  },
} as const;

export default Config;
