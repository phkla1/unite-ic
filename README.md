# unite-ic
Thanks to @shawndotey for angular code that got this started.
Process to run locally is to use the npm scripts (see below) or the standard dfx process:
dfx start --clean --background
rm -rf .dfx/local  //remove any old canisters
dfx canister create --all
dfx build
dfx canister install --all //make sure you've taken note of frontend canisterId

Then access the frontend canister via http://localhost:8000?canisterId=ID-OF-FRONTEND-CANISTER

### package.json Scripts
    npm run [script name]
| Name | Description |
| ----------- | ----------- |
| ng-start | Start the Angular and the IC server locally with live reloading |
| ng-serve | Serve and watch both Angular and the IC server for changes |
| ng-start-dfx | Stop IC server when needed and re-start the IC server |
| build-dfx-www | Build and Serve the Angular application on the local IC server
| print-dfx-www | Print the url to the local IC server Angular application
&nbsp;

---

### To learn more about working with dfx, see the following documentation available online:

- [Quick Start](https://sdk.dfinity.org/docs/quickstart/quickstart-intro.html)
- [SDK Developer Tools](https://sdk.dfinity.org/docs/developers-guide/sdk-guide.html)
- [Motoko Programming Language Guide](https://sdk.dfinity.org/docs/language-guide/motoko.html)
- [Motoko Language Quick Reference](https://sdk.dfinity.org/docs/language-guide/language-manual.html)
- [JavaScript API Reference](https://erxue-5aaaa-aaaab-qaagq-cai.raw.ic0.app)
