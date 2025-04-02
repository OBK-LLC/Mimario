const TOKEN_KEY = "auth.token";

interface StoredToken {
  token: string;
  refresh_token: string;
}

export const tokenStorage = {
  setTokens(token: string, refresh_token: string): void {
    localStorage.setItem(
      TOKEN_KEY,
      JSON.stringify({
        token,
        refresh_token,
      })
    );
  },

  getTokens(): StoredToken | null {
    const tokenData = localStorage.getItem(TOKEN_KEY);
    if (!tokenData) return null;

    try {
      return JSON.parse(tokenData);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  },

  clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  hasTokens(): boolean {
    return !!this.getTokens();
  },
};
