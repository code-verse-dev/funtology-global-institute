import { createContext, useContext } from "react";

const NonprofitAdminModeContext = createContext(false);

export function NonprofitAdminProvider({ children }: { children: React.ReactNode }) {
  return <NonprofitAdminModeContext.Provider value={true}>{children}</NonprofitAdminModeContext.Provider>;
}

/** True when rendered inside the non-profit admin layout (non-profit API base URL). */
export function useNonprofitAdminMode(): boolean {
  return useContext(NonprofitAdminModeContext);
}
