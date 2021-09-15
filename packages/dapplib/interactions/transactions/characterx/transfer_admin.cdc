import CharacterX from Project.CharacterX
//import CharacterXAdminReceiver from 0x 
//Does not exist but make something similar to https://flowscan.org/contract/A.e1f2a091f7bb5245.TopshotAdminReceiver

transaction {
    let adminRef: @CharacterX.Admin

    prepare(acct: AuthAccount) {
        self.adminRef <- acct.load<@CharacterX.Admin>(from: CharacterX.AdminStoragePath)
            ?? panic("No CharacterX Admin in storage")
    }

    execute {
        CharacterXAdminReceiver.storeAdmin(newAdmin: <-self.adminRef)
    }
}