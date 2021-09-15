//Does not seem to wo

import CharacterX from Project.CharacterX

transaction(setID: UInt32) {
    let adminRef: &CharacterX.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&CharacterX.Admin>(from: CharacterX.AdminStoragePath)
            ?? panic("No Admin resource in storage")
    }

    execute {
        let setRef = self.adminRef.borrowSet(setID: setID)
        setRef.lock()
    }

    post {
        CharacterX.isSetLocked(setID: setID)!:
            "Set didn't lock"
    }
}