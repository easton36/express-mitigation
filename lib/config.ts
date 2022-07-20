export interface Config{
    userAgent?: {
        mode: string; // 'blacklist' or 'whitelist'
        items: string[]; // list of user agent strings
        errorMessage?: string; //error message to throw
    },
    ip?: {
        mode: string; // 'blacklist' or 'whitelist'
        items: string[]; // list of ips
        errorMessage?: string; //error message to throw
    },
    ratelimit?: {
        amount: number; // amount of requests to make before ratelimit
        cooldown: number; // time in milliseconds to wait before allowing requests
        errorMessage?: string; //error message to throw
    },
    tor?: {
        block: boolean; //block tor requests
        errorMessage: string; //error message to throw
        userKey: string; // req.userKey
        redirect?: {
            clearNetDomain: string, // domain name for clearnet traffic
            torDomain: string, //domain name for tor traffic
            redirectClearNet: boolean; //redirect clearnet traffic if accessing from tor domain
            redirectTor: boolean; //redirect tor traffic if accessing from clearnet domain
        }
    },
    store: any;
}