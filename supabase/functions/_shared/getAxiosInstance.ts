import { Logger } from "../_infrastructure/logging/Logger.ts";
import { Axios, AxiosError, AxiosInstance, AxiosRetry } from "../deps.ts";

/**
 * Get an axios instance configured with the given baseURL and logging.
 * An initial retry mechanism can be added if so requested by a parameter.
 *
 * @param baseURL The baseURL of the endpoints you need to call
 * @param withRetry Whether to retry network errors (default=true).
 *                  Uses an exponential backoff strategy and retries up to 3 times.
 * @param getToken If present, add authorization header token
 * @param attachTokenProvider A replacement for `getToken`, attaches a token provider to Axios
 * @returns an AxiosInstance
 */
export const getAxiosInstance =
  (
    baseURL?: string,
    withRetry: boolean = true,
    getToken?: () => Promise<string>,
    attachTokenProvider?: (axiosInstance: AxiosInstance) => Promise<undefined>,
  ) =>
  () => {
    const axiosInstance = Axios.create({
      baseURL,
    });

    // Attach logging
    axiosInstance.interceptors.request.use(
      async function (requestConfig: any) {
        Logger.debug("Making http call", {
          baseURL: requestConfig.baseURL,
          url: requestConfig.url,
          method: requestConfig.method, // GET, PUT, POST
        });
        if (getToken) {
          requestConfig.headers["Authorization"] = await getToken();
        }
        requestConfig.headers["Content-Type"] = "application/json";
        return requestConfig;
      },
      function (error: any) {
        return Promise.reject(error);
      },
    );

    axiosInstance.interceptors.response.use(
      function (response: any) {
        // Log url and method here also for when multiple requests are made in parallel
        Logger.debug("Response of http call", {
          baseURL: response.config.baseURL,
          url: response.config.url,
          method: response.config.method, // GET, PUT, POST
          status: response.status,
          statusText: response.statusText,
        });
        return response;
      },
      function (error: any) {
        if (error instanceof AxiosError) {
          //Specify the exact fields to log, since the entire request object may contain sensitive data
          Logger.error("http call error", {
            code: error.code,
            message: error.message,
            status: error.status,
            cause: error.cause,
          });
        }
        return Promise.reject(error);
      },
    );

    if (withRetry) {
      attachRetry(axiosInstance);
    }

    if (attachTokenProvider) {
      attachTokenProvider(axiosInstance);
    }

    return axiosInstance;
  };

/**
 * Attach a retry mechanism to the given axios instance
 *
 * @param axiosInstance the axios instance
 * @returns the axios instance with a retry mechanism
 */
function attachRetry(axiosInstance: AxiosInstance): AxiosInstance {
  // Attach retry for communication errors
  AxiosRetry(axiosInstance, {
    retries: 3,
    retryCondition: error => {
      return (
        AxiosRetry.isNetworkOrIdempotentRequestError(error) ||
        error.code === "ECONNABORTED" ||
        error.code === "ETIMEDOUT"
      );
    },
    onRetry: (retryCount: any, error: any, requestConfig: any) => {
      Logger.info("Retrying http call", {
        baseURL: requestConfig.baseURL,
        url: requestConfig.url,
        method: requestConfig.method, // GET, PUT, POST
        retryCount,
        errorCode: error.code,
        errorMessage: error.message,
      });
    },
    retryDelay: AxiosRetry.exponentialDelay,
  });
  return axiosInstance;
}
