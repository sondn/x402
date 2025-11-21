# x402

# How to use:


### Update ENV file

    cp .env.example .env
    
  Update your env for EVM or SVM

### Build & run

0. `yarn install`
1. `yarn start:facilitator` => Start facilitator server self-host
2. `yarn start:server` => Start api server
3. `yarn start:client` => Client call to protected api, payment require before response data

Done, view your onchain transaction after client show payment success
