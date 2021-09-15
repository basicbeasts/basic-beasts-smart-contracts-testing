import CharacterX from Project.CharacterX

transaction(setID: UInt32, characterID: UInt32, quantity: UInt64, recipientAddr: Address) {
    
    let adminRef: &CharacterX.Admin

    prepare(acct: AuthAccount) {

        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)!

    }

    execute {
        let setRef = self.adminRef.borrowSet(setID: setID)

        let collection <- setRef.batchMintCharacter(characterID: characterID, quantity: quantity)

        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(CharacterX.CollectionPublicPath).borrow<&{CharacterX.CharacterCollectionPublic}>()
            ?? panic("Cannot borrow a reference to the recipient's collection")

        receiverRef.batchDeposit(tokens: <-collection)
    }
}