import makeFetchCookie, { CookieJar } from 'npm:fetch-cookie';

const COMMON_HEADERS = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "accept": "*/*"
}

const cookieJar: CookieJar = new makeFetchCookie.toughCookie.CookieJar();
const fetchCookie = makeFetchCookie(fetch, cookieJar);

export interface Config {
  AgentboxBaseUrl : string
}

export async function agentboxAuthenticate(username : string, password : string, config : Config) {

  // 01
  let res = await fetchCookie(config.AgentboxBaseUrl + "/admin/login", {
    headers: COMMON_HEADERS,
    redirect: "manual"
  });

  const authLocation = res.headers.get("location")!;

  // 02
  res = await fetchCookie(authLocation, {
    headers: COMMON_HEADERS,
    redirect: "manual"
  });

  const xsrf_auth = res.headers.getSetCookie().find(x => x.startsWith("XSRF-TOKEN="))!.split(";")[0].split("=")[1];

  // 03
  res = await fetchCookie(authLocation, {
    method: "POST",
    headers: {
      ...COMMON_HEADERS,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    redirect: "manual",
    body: new URLSearchParams({
      "_csrf": xsrf_auth,
      "username": username,
      "password": password
    })
  });

  // 04
  res = await fetchCookie(res.headers.get("location")!, {
    headers: COMMON_HEADERS,
    redirect: "manual"
  });

  // 05
  res = await fetchCookie(res.headers.get("location")!, {
    headers: COMMON_HEADERS,
    redirect: "manual"
  });

  // 06
  res = await fetchCookie(config.AgentboxBaseUrl + res.headers.get("location"), {
    headers: {
      ...COMMON_HEADERS
    },
    redirect: "manual"
  })

  const cookieStr = await cookieJar.getCookieString(config.AgentboxBaseUrl + "/admin/master");
  const csrf = cookieStr.split(";").map(x => x.trim()).find(x => x.startsWith("_csrf="))!.split("=").at(-1)!;
  return { cookieStr, csrf };
}

