import FungibleToken from "../../../contracts/Flow/FungibleToken.cdc"
import FUSD from "../../../contracts/Flow/FUSD.cdc"

transaction(amount: UFix64, to: Address, referrer: Address) {

    let vault: @FungibleToken.Vault
    let referrerBonus: @FungibleToken.Vault
    

    prepare(signer: AuthAccount) {
        
       if   {
            self.vault <- signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)!.withdraw(amount: amount)

            //amount is 95% of actual price as 5% has been subtracted due to referral 
            //referrerBonus is 5% of the actual price
            let referrerBonusAmount = amount / 0.95 * 0.05

            self.referrerBonus <- self.vault.withdraw(amount: referrerBonusAmount)
        } //?? panic("You can not referer to yourself")
    }

    execute {

        getAccount(referrer).getCapability(/public/fusdReceiver)!.borrow<&{FungibleToken.Receiver}>()!
            .deposit(from: <-self.referrerBonus)

        getAccount(to).getCapability(/public/fusdReceiver)!.borrow<&{FungibleToken.Receiver}>()!
            .deposit(from: <-self.vault)
    }
}
