import NonFungibleToken from "../../../contracts/Flow/NonFungibleToken.cdc"
import CharacterX from "../../../contracts/Project/CharacterX.cdc"

transaction(recipientAddr: Address, characterID: UInt64) {
    
    prepare(acct: AuthAccount) {
        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(CharacterX.CollectionPublicPath)
            .borrow<&{CharacterX.CharacterCollectionPublic}>()
                ?? panic("Couldn't borrow reference to Receiver's collection")
    

        if let collection = acct.borrow<&CharacterX.Collection>(from: CharacterX.CollectionStoragePath) {
            receiverRef.deposit(token: <-collection.withdraw(withdrawID: characterID))
        }

    }
}