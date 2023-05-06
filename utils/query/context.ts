import type { QueryClient } from "@tanstack/react-query";
import * as React from "react";

export const queryClientContext = React.createContext<QueryClient | undefined>(undefined);
