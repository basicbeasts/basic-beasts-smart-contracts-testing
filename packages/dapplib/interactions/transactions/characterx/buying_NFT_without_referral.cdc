import FungibleToken from "../../../contracts/Flow/FungibleToken.cdc"
import FUSD from "../../../contracts/Flow/FUSD.cdc"

transaction(amount: UFix64, to: Address) {

    let vault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {
        self.vault <- signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)!.withdraw(amount: amount)
    }

    execute {
        getAccount(to).getCapability(/public/fusdReceiver)!.borrow<&{FungibleToken.Receiver}>()!
            .deposit(from: <-self.vault)
    }
}

/* 

import FungibleToken from "../../../contracts/Flow/FungibleToken.cdc"

transaction(amount: UFix64, to: Address) {

    let vault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {
        self.vault <- signer.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!.withdraw(amount: amount)
    }

    execute {
        getAccount(to).getCapability(/public/flowTokenReceiver)!.borrow<&{FungibleToken.Receiver}>()!
            .deposit(from: <-self.vault)
    }
}

 */