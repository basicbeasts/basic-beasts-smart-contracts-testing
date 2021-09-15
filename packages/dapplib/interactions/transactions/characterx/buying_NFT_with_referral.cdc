import FungibleToken from Flow.FungibleToken

transaction(amount: UFix64, to: Address, referrer: Address) {

    let vault: @FungibleToken.Vault
    let referrerBonus: @FungibleToken.Vault

    prepare(signer: AuthAccount) {
        self.vault <- signer.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!.withdraw(amount: amount)

        //amount is 95% of actual price as 5% has been subtracted due to referral 
        //referrerBonus is 5% of the actual price
        let referrerBonusAmount = amount / 0.95 * 0.05

        self.referrerBonus <- self.vault.withdraw(amount: referrerBonusAmount)

    }

    execute {

        getAccount(referrer).getCapability(/public/flowTokenReceiver)!.borrow<&{FungibleToken.Receiver}>()!
            .deposit(from: <-self.referrerBonus)

        getAccount(to).getCapability(/public/flowTokenReceiver)!.borrow<&{FungibleToken.Receiver}>()!
            .deposit(from: <-self.vault)
    }
}
