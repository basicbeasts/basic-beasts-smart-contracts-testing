import CharacterX from Project.CharacterX

transaction(setID: UInt32, characterID: UInt32) {
    let adminRef: &CharacterX.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)
            ?? panic("No Admin resource in storage")
    }

    execute {
        let setRef = self.adminRef.borrowSet(setID: setID)

        setRef.retireCharacter(characterID: characterID)
    }

    post {
        CharacterX.isEditionRetired(setID: setID, characterID: characterID) == true:
            "Character is not retired"
    }
}