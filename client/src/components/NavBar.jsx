import mailbox from "../assets/mailbox.png";
import people from "../assets/people.png"
import share from "../assets/share.png"
import rising from "../assets/rising.png"
import user from "../assets/user.png"

export function NavBar() {
    return (
      <div className="bg-blue-600 min-h-screen flex flex-col items-center">
        <div>
          <img src={share} alt="" />
        </div>
        <div>
          <img src={mailbox} alt="" />
        </div>
        <div>
          <img src={people} alt="" />
        </div>
        <div>
          <img src={rising} alt="" />
        </div>
        <div className="mt-96">
          <img src={user} alt="" />
        </div>
      </div>
    );
  }
  