import CharacterX from "../../../contracts/Project/CharacterX.cdc"

transaction(setName: String) {
    let adminRef: &CharacterX.Admin
    let currentSetID: UInt32
    
    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)
            ?? panic("Couldn't borrow a reference to the Admin resource")
            self.currentSetID = CharacterX.nextSetID;
    }

    execute {
        self.adminRef.createSet(name: setName)
    }

    post {
        CharacterX.getSetName(setID: self.currentSetID) == setName:
            "Couldn't find the specified set"
    }
}