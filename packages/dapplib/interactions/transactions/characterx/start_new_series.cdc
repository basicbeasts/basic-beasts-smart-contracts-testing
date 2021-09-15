import CharacterX from Project.CharacterX

transaction {

    let adminRef: &CharacterX.Admin
    let currentSeries: UInt32

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)
            ?? panic("No Admin resource in storage")

        self.currentSeries = CharacterX.currentSeries

    }

    execute {
        self.adminRef.startNewSeries()
    }

    post {
        CharacterX.currentSeries == self.currentSeries + 1 as UInt32:
            "New Series is not started"
    }
}