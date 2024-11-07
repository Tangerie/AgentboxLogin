import makeFetchCookie, { CookieJar } from 'npm:fetch-cookie';

const COMMON_HEADERS = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "accept": "*/*"
}

// @ts-ignore
const cookieJar: CookieJar = new makeFetchCookie.toughCookie.CookieJar();
const fetchCookie = makeFetchCookie(fetch, cookieJar);  

export async function corelogicLogin(username : string, password : string) {
    // 01
    let res : Response;

    res = await fetchCookie("https://rpp.corelogic.com.au/oauth2/authorization/auth", {
        headers: COMMON_HEADERS,
        redirect: "manual"
    });

    // 02
    res = await fetchCookie(res.headers.get("location")!, {
        headers: COMMON_HEADERS,
        redirect: "manual"
    });

    const asKey = (await res.text()).match(/\/as\/.*\/resume/)![0].split("/")[2]

    // 03
    res = await fetchCookie(`https://auth.corelogic.asia/as/${asKey}/resume/as/authorization.ping`, {
        method: "POST",
        headers: COMMON_HEADERS,
        body: new URLSearchParams({
            "pf.username": username,
            "pf.pass": password,
            "pf.ok": "clicked",
            "pf.cancel": "",
            "pf.passwordreset": "",
            "pf.adapterId": "SessionIdPAppPermAdapter"
        }),
        redirect: "manual"
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
    })

    const cookieStr = await cookieJar.getCookieString("https://rpp.corelogic.com.au/api");
    const csrf = cookieStr.split(";").map(x => x.trim()).find(x => x.startsWith("APP2SESSION-XSRF="))!.split("=").at(-1)!;
    return { cookieStr, csrf };
}