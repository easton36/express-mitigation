import { Config } from './lib/config';
import Store from './lib/store';
import DetectTor from 'express-tor-detection';

const middlewear = (config: Config = {
    store: new Store(),
}) => async (req: any, res: any, next: any): Promise<void> => {
    // get the ip from the request
    let ip: string = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // isolate ipv4 address from prefix
    if(ip.substring(0, 7) === '::ffff:'){
        ip = ip.substring(7);
    }
    //get the user agent string
    let userAgent: string = req.headers['user-agent'];
    
    //validate useragent
    if(config.userAgent){
        let userAgentIncluded = config.userAgent.items.includes(userAgent);
        switch(config.userAgent.mode){
            case 'blacklist':
                if(userAgentIncluded){
                    return next(Error(config.userAgent.errorMessage || 'Your device is blacklisted.'));
                }
                break
            case 'whitelist':
                if(!userAgentIncluded){
                    return next(Error(config.userAgent.errorMessage || 'Your device is not whitelisted.'));
                }
                break;                
        }
    }

    //validate ip
    if(config.ip){
        let ipIncluded = config.ip.items.includes(ip);
        switch(config.ip.mode){
            case 'blacklist':
                if(ipIncluded){
                    return next(Error(config.ip.errorMessage || 'Your IP is blacklisted.'));
                }
                break
            case 'whitelist':
                if(!ipIncluded){
                    return next(Error(config.ip.errorMessage || 'Your IP is not whitelisted.'));
                }
                break;  
        }
    }

    //check tor
    if(config.tor){
        DetectTor(config.tor)(req, res, (err?: Error)=>{
            if(err){
                return next(err);
            }
        });
    }

    //check ratelimits
    if(config.ratelimit){
        //get requests from store
        let requestCount: number | null = config.store.get(ip);
        if(requestCount){
            if(requestCount === config.ratelimit.amount){
                return next(Error(config.ratelimit.errorMessage || 'You are ratelimited. Try again later.'));
            }
            if(requestCount === (config.ratelimit.amount - 1)){
                let set: boolean = config.store.set(ip, requestCount + 1, config.ratelimit.cooldown);
            }
        } else{
            config.store.set(ip, 1);
        }
    }

    next();
};

export = middlewear;