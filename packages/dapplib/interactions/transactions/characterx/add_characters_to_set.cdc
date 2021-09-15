import CharacterX from Project.CharacterX

transaction(setID: UInt32, characters: [UInt32]) {

    let adminRef: &CharacterX.Admin
    
    prepare(acct: AuthAccount) {

        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)!

    }

    execute {
        let setRef = self.adminRef.borrowSet(setID: setID)

        setRef.addCharacters(characterIDs: characters)
    }
}