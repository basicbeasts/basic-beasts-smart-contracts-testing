import NonFungibleToken from Flow.NonFungibleToken
import CharacterX from Project.CharacterX

transaction(recipientAddr: Address, characterIDs: [UInt64]) {
    
    prepare(acct: AuthAccount) {
        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(CharacterX.CollectionPublicPath)
            .borrow<&{CharacterX.CharacterCollectionPublic}>()
                ?? panic("Couldn't borrow reference to Receiver's collection")
    

        if let collection = acct.borrow<&CharacterX.Collection>(from: CharacterX.CollectionStoragePath) {
            receiverRef.batchDeposit(tokens: <-collection.batchWithdraw(ids: characterIDs))
        }

    }
}