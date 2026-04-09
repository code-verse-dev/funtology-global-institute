const { hostname } = window.location;

const servers = {
  local: "http://localhost:3031",
  customDev: "https://react.customdev.solutions:3031",
  live: "https://api.funtologyglobalinstitute.com",
};

/** Non-profit FGI API (separate backend). Used only in admin “Non-profit” layout. */
const nonprofitServers = {
  local: "http://localhost:3034",
  customDev: "https://react.customdev.solutions:3034",
  live: "https://api.nonprofit.funtologyglobalinstitute.com",
};

let publicUrl = "/";

let URL;
if (hostname.includes("react.customdev.solutions")) URL = servers.customDev;
else if (hostname.includes("local")) URL = servers.local;
else URL = servers.live;

let nonprofitUrl: string;
if (hostname.includes("react.customdev.solutions")) nonprofitUrl = nonprofitServers.customDev;
else if (hostname.includes("local")) nonprofitUrl = nonprofitServers.local;
else nonprofitUrl = nonprofitServers.live;

export const SOCKET_URL = `${URL}`;
export const UPLOADS_URL = URL + "/Uploads/";
export const BASE_URL = URL + "/api";
export const PUBLIC_URL = publicUrl;

export const NONPROFIT_SOCKET_URL = `${nonprofitUrl}`;
export const NONPROFIT_UPLOADS_URL = nonprofitUrl + "/Uploads/";
export const NONPROFIT_BASE_URL = nonprofitUrl + "/api";
