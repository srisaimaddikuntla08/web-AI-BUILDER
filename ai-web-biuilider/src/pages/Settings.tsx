
import { AccountSettingsCards, ChangePasswordCard, DeleteAccountCard } from "@daveyplate/better-auth-ui"

const Settings = () => {
  return (  

    <div className="w-full p-4 min-h-[90vh]  justify-center items-center gap-8">
        <AccountSettingsCards classNames={{card:{base:'bg-black/10 ring ring-indigo-950 max-w-xl mx-auto',footer:"bg-black/10 ring ring-indigo-950"}}}/>


        <div className="w-full mt-8">
            <ChangePasswordCard  classNames={{base:'bg-black/10 ring ring-indigo-950 max-w-xl mx-auto',footer:"bg-black/10 ring ring-indigo-950"}}/>
        </div>

          <div className="w-full">
            <DeleteAccountCard  classNames={{base:"bg-black/10 ring ring-indigo-950 max-w-xl mx-auto mt-1"}} />
        </div>
    </div>

      


  )
}

export default Settings