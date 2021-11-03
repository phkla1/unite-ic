# unite-ic
Thanks to @shawndotey for angular code that got this started.
Process to run locally is per usual:

#DFX
dfx start --clean --background

#II
II_ENV=development dfx deploy --no-wallet --argument '(null)'
//The canister id of II should be used as LOCAL_II_CANISTER in unite-ic.service.ts
//You will probably need to use ngrok to expose the local II (via dfx) to Unite (e.g ngrok http -host-header=rewrite localhost:8000). If so ensure that LOCAL_II_URL in unite-ic.service.ts is updated 

#UNITE
rm -rf .dfx/local  //remove any old canisters in the project directory
dfx canister create --all
dfx build
dfx canister install --all //make sure you've taken note of frontend canisterId

