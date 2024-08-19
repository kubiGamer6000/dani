interface GeolocationOptions {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}

const defaultOptions: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

export async function getCurrentPosition(
  options: Partial<GeolocationOptions> = {}
): Promise<GeolocationPosition> {
  const geolocationOptions: GeolocationOptions = {
    ...defaultOptions,
    ...options,
  };

  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        resolve,
        (error) => {
          let userFriendlyMessage: string;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              userFriendlyMessage =
                "Please enable location services to check in.";
              break;
            case error.POSITION_UNAVAILABLE:
              userFriendlyMessage =
                "Unable to determine your location. Please try again.";
              break;
            case error.TIMEOUT:
              userFriendlyMessage =
                "It's taking too long to find your location. Please try again.";
              break;
            default:
              userFriendlyMessage =
                "An unexpected error occurred while getting your location.";
          }
          reject(new Error(userFriendlyMessage));
        },
        geolocationOptions
      );
    } else {
      reject(
        new Error(
          "Geolocation is not supported by your browser. Please use a different device or browser."
        )
      );
    }
  });
}
