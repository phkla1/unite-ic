# unite-ic
Thanks to @shawndotey for angular code that got this started.
Process to run locally is the usual:
dfx start --clean --background
rm -rf .dfx/local  //remove any old canisters
dfx canister create --all
dfx build
dfx canister install --all //make sure you've taken note of frontend canisterId

