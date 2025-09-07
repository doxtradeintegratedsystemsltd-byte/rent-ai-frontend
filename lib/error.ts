import axios, { type AxiosError } from "axios";

// Extract a human-friendly error message from an Axios / unknown error
export function getApiErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred.",
) {
  // Direct string
  if (typeof error === "string") return error;

  // Standard Error object
  if (error instanceof Error) {
    // Axios error branch
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError;
      const responseData = axiosErr.response?.data as unknown;
      if (typeof responseData === "string") return responseData;
      if (isRecord(responseData)) {
        if (isNonEmptyString(responseData.message)) return responseData.message;
        if (isNonEmptyString(responseData.error)) return responseData.error;
        const errs = responseData.errors;
        if (Array.isArray(errs) && errs.length) {
          const collected = (errs as unknown[])
            .map((e) => {
              if (typeof e === "string") return e;
              if (isRecord(e) && isNonEmptyString(e.message)) return e.message;
              return undefined;
            })
            .filter((v): v is string => Boolean(v))
            .join("; ");
          if (collected) return collected;
        }
      }
      // Network / no response
      if (!axiosErr.response) {
        return "Network error. Please check your connection.";
      }
    }
    // Fallback to native message
    if (error.message) return error.message;
  }

  try {
    // Last resort attempt to stringify
    return JSON.stringify(error);
  } catch {
    return fallback;
  }
}

// Type guards/helpers
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
