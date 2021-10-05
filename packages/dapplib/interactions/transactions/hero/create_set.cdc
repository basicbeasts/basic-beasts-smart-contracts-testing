import Hero from "../../../contracts/Project/Hero.cdc"

transaction(setName: String) {
    let adminRef: &Hero.Admin
    let currentSetID: UInt32
    
    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&Hero.Admin>(from: Hero.AdminStoragePath)
            ?? panic("Couldn't borrow a reference to the Admin resource")
            self.currentSetID = Hero.nextSetID;
    }

    execute {
        self.adminRef.createSet(name: setName)
    }

    post {
        Hero.getSetName(setID: self.currentSetID) == setName:
            "Couldn't find the specified set"
    }
}