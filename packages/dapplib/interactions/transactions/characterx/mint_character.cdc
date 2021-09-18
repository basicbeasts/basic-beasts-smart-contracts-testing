import CharacterX from "../../../contracts/Project/CharacterX.cdc"

transaction(setID: UInt32, characterID: UInt32, recipientAddr: Address) {
    let adminRef: &CharacterX.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)!
    }

    execute {
        let setRef = self.adminRef.borrowSet(setID: setID)

        let newMintedCharacter <- setRef.mintCharacter(characterID: characterID)

        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(CharacterX.CollectionPublicPath).borrow<&{CharacterX.CharacterCollectionPublic}>()
            ?? panic("Can't borrow a reference to the Recipient's Character collection")

        receiverRef.deposit(token: <-newMintedCharacter)
    }
}