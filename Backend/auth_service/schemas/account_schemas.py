from pydantic import BaseModel
import hashlib
from enum import Enum
from datetime import datetime
from Database import Postgresql

def compute_hash(data: str) -> str:
    hash_object = hashlib.sha256()
    hash_object.update(data.encode('utf-8'))
    return hash_object.hexdigest()

class Account(BaseModel):
    username: str = None
    password: str = None
    email: str = None
    OTP: str = None

    def checkAccount(self) -> bool:
        db = Postgresql()
        result = db.select('account', '*', f"username = '{self.username}' and password = '{compute_hash(self.password)}'")
        db.close()
        return result is not None

    def getInfoAccount(self) -> dict:
        db = Postgresql()
        info = db.execute(f"select c.id, c.email, c.username, p.name from account c JOIN role r on c.id=r.user_id JOIN permission p on p.id=r.permission_id where c.username='{self.username}'")
        return {"id": info[0], "email": info[1], "username": info[2], "role":info[3]} if info else {}

    def insertAccount(self, OTP: str):
        db = Postgresql()
        result = db.insert('account', 'username, password ,email, verified', f"'{self.username}', '{compute_hash(self.password)}','{self.email}', {OTP}")
        db.commit()
        db.close()
        return result

    def checkActive(self) -> bool:
        db = Postgresql()
        result = db.select('account', 'active', f"username = '{self.username}'")
        db.close()
        return result[0]

    def verifyEmail(self) -> bool:
        db = Postgresql()
        id = db.select('account', 'id', f"username = '{self.username}' and verified = '{self.OTP}'")
        if id is None:
            return False
        id = id[0]
        db.update('account', f"active = true", f"username='{self.username}'")
        db.insert('"user"', 'user_id', id)
        db.insert('role', 'user_id, permission_id', f"{id}, 3")
        db.commit()
        db.close()
        return True

    def existenceUsername(self) -> bool:
        db = Postgresql()
        result = db.select('account', 'username', f"username = '{self.username}'")
        db.close()
        return result is not None

    def existenceEmail(self) -> bool:
        db = Postgresql()
        result = db.select('account', 'email', f"email = '{self.email}'")
        db.close()
        return result is not None

    def updatePassword(self, new_password: str):
        db = Postgresql()
        db.update('account', f"password = '{compute_hash(new_password)}'", f"email = '{self.email}'")
        db.commit()
        db.close()
        
    def deleteAccount(self):
        db = Postgresql()
        db.delete('account', f"username='{self.username}'")
        db.commit()
        db.close()

    @staticmethod
    def authorization(token: str):
        db = Postgresql()
        result = db.select('account', 'username', f"token = '{token}'")


    def getRole(self):
        sql=f"SELECT permission.name FROM account JOIN role ON account.id = role.user_id JOIN permission ON role.permission_id = permission.id WHERE username = '{self.username}'"
        db = Postgresql()
        result = db.execute(sql)
        return result[0]

class ChangePassword(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

    def changePassword(self, username: str, new_password: str):
        db = Postgresql()
        db.update(
            'account',
            f"password = '{compute_hash(new_password)}'",
            f"username = '{username}'"
        )
        db.commit()
        db.close()
        
class Role(str, Enum):
    admin = "admin"
    technical = "technical"
    user = "user"

class AddUser(BaseModel):
    username: str
    password: str
    permission_id: int
    email: str = None

    def insert_user(self):
        db = Postgresql()
        hashed_password = compute_hash(self.password)

        email_part = f", email" if self.email else ""
        email_value = f", '{self.email}'" if self.email else ""

        db.insert(
            'account',
            f'username, password{email_part}, active, created', 
            f"'{self.username}', '{hashed_password}'{email_value}, true, '{datetime.now()}'"
        )
        
        user_id = db.select(
            'account',
            'id',
            f"username = '{self.username}' AND password = '{hashed_password}'"
        )[0]
        
        db.insert(
            '"user"',  
            'user_id',
            f"{user_id}" 
        )

        db.insert(
            'role',
            'user_id, permission_id',
            f"{user_id}, {self.permission_id}"
        )
        
        db.commit()
        db.close()
        return user_id