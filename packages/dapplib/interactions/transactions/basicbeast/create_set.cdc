import BasicBeast from "../../../contracts/Project/BasicBeast.cdc"

transaction(setName: String) {
    let adminRef: &BasicBeast.Admin
    let currentSetID: UInt32
    
    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)
            ?? panic("Couldn't borrow a reference to the Admin resource")
            self.currentSetID = BasicBeast.nextSetID;
    }

    execute {
        self.adminRef.createEvolutionSet(name: setName)
    }

    post {
        BasicBeast.getEvolutionSetName(setID: self.currentSetID) == setName:
            "Couldn't find the specified set"
    }
}