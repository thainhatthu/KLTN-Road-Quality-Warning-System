from datetime import date, datetime
from typing import Tuple
from Database import Postgresql
from pydantic import BaseModel
import json

class User(BaseModel):
    username: str
    fullname: str = None
    avatar: str = None
    birthday: date = None
    gender: str = None
    phonenumber: str = None
    location: str = None
    state: str = None

    def update_user_info(self) -> bool:
        db = Postgresql()
        try:
            fields = {
                "fullname": self.fullname,
                "birthday": self.birthday,
                "gender": self.gender,
                "phonenumber": self.phonenumber,
                "location": self.location,
                "state": self.state,
            }
            set_clauses = [f"{key} = '{value}'" for key, value in fields.items() if value is not None]

            if not set_clauses:
                print("No fields to update.")
                return False

            set_clause = ", ".join(set_clauses)

            db.update(
                '"user"',
                set_clause,
                f"user_id = (SELECT id FROM account WHERE username = '{self.username}')"
            )
            db.commit()
            return True
        except Exception as e:
            print(f"Error updating user info: {e}")
            return False
        finally:
            db.close()

    def get_profile(self) -> dict:
        db = Postgresql()
        try:
            user_result = db.select(
                '"user"',
                'user_id, fullname, birthday, gender, phonenumber, location, state',
                f"user_id = (SELECT id FROM account WHERE username = '{self.username}')"
            )

            account_result = db.select(
                '"account"',
                'email, created',
                f"username = '{self.username}'"
            )

            contribution_query = '''
                SELECT COUNT(*)
                FROM road
                WHERE user_id = (SELECT id FROM account WHERE username = %s)
            '''
            db.cursor.execute(contribution_query, (self.username,))
            contribution = db.cursor.fetchone()[0]

            if user_result:
                birthday = user_result[2].strftime('%Y-%m-%d') if isinstance(user_result[2], date) else user_result[2]

                profile_data = {
                    "user_id": user_result[0],
                    "fullname": user_result[1],
                    "birthday": birthday,
                    "gender": user_result[3],
                    "phonenumber": user_result[4],
                    "location": user_result[5],
                    "state": user_result[6],
                    "contribution": contribution  
                }

                if account_result:
                    profile_data.update({
                        "email": account_result[0],
                        "created": account_result[1].strftime('%Y-%m-%d %H:%M:%S') if isinstance(account_result[1], date) else account_result[1]
                    })

                return profile_data
            return {}

        except Exception as e:
            print(f"Error getting profile: {e}")
            return {}
        finally:
            db.close()

    def update_avatar(self, avatar_path: str) -> bool:
        db = Postgresql()
        try:
            db.update(
                '"user"',
                f"avatar = '{avatar_path}'",
                f"user_id = (SELECT id FROM account WHERE username = '{self.username}')"
            )
            db.commit()
            return True
        except Exception as e:
            print(f"Error updating avatar: {e}")
            return False
        finally:
            db.close()

    def get_avatar(self) -> str:
        db = Postgresql()
        try:
            result = db.select(
                '"user"',
                'avatar',
                f"user_id = (SELECT id FROM account WHERE username = '{self.username}')"
            )
            if result and result[0]:
                return result[0]
            return None
        except Exception as e:
            print(f"Error getting avatar: {e}")
            return None
        finally:
            db.close()

    def get_user_statistics(self) -> dict:
        db = Postgresql()
        try:
            query = '''
                SELECT u.user_id, u.fullname, a.username, a.created
                FROM "user" u
                JOIN "account" a ON u.user_id = a.id
                JOIN "role" r ON r.user_id = a.id
                WHERE r.permission_id = 3
            '''

            user_results = db.execute(query, fetch='all')

            if not user_results:
                return {"data": []}

            users_data = []
            for row in user_results:
                created = row[3].strftime('%Y-%m-%d %H:%M:%S') if isinstance(row[3], datetime) else row[3]
                avatar = f"/user/api/getAvatar?username={row[2]}"
                
                count_query = '''
                    SELECT COUNT(*) 
                    FROM "road" 
                    WHERE user_id = %s
                '''
                db.cursor.execute(count_query, (row[0],)) 
                contribution = db.cursor.fetchone()[0] 
                
                users_data.append({
                    "user_id": row[0],
                    "fullname": row[1],
                    "username": row[2],
                    "created": created,
                    "avatar": avatar,
                    "contribution": contribution  
                })

            return {"data": users_data}

        except Exception as e:
            print(f"Error getting users: {e}")
            return {"data": []}
        finally:
            db.close()

    def get_technical_statistics(self) -> list:
        db = Postgresql()
        try:
            query = '''
                SELECT u.user_id, u.fullname, a.username, a.created
                FROM "user" u
                JOIN "account" a ON u.user_id = a.id
                JOIN "role" r ON r.user_id = a.id
                WHERE r.permission_id = 2
            '''

            user_results = db.execute(query, fetch='all')

            if not user_results:
                return {"data": []}

            users_data = []

            for row in user_results:
                task_done_query = f'''
                    SELECT COUNT(*)
                    FROM "assignment"
                    WHERE user_id = {row[0]} AND status = 'Done'
                '''
                task_done = db.execute(task_done_query, fetch='one')[0]

                all_task_query = f'''
                    SELECT COUNT(*)
                    FROM "assignment"
                    WHERE user_id = {row[0]}
                '''
                all_task = db.execute(all_task_query, fetch='one')[0]

                created = row[3].strftime('%Y-%m-%d %H:%M:%S') if isinstance(row[3], datetime) else row[3]
                avatar = f"/user/api/getAvatar?username={row[2]}"
                
                users_data.append({
                    "user_id": row[0],
                    "fullname": row[1],
                    "username": row[2],
                    "created": created,
                    "avatar": avatar,
                    "task_done": task_done,
                    "all_task": all_task
                })

            return {"data": users_data}

        except Exception as e:
            print(f"Error getting users: {e}")
            return {"data": []}
        finally:
            db.close()

    def get_valid_wards(self) -> dict:
        db = Postgresql()
        try:
            query = """
                SELECT w.name, d.name, p.name
                FROM "road" r
                JOIN "ward" w ON r.ward_id = w.id
                JOIN "district" d ON w.district_id = d.id
                JOIN "province" p ON d.province_id = p.id
                WHERE NOT EXISTS (
                    SELECT 1 
                    FROM "assignment" a 
                    WHERE a.ward_id = w.id
                )
            """
            ward_results = db.execute(query, fetch='all')

            if not ward_results:
                return {}

            locations = {}
            for ward_name, district_name, province_name in ward_results:
                if province_name not in locations:
                    locations[province_name] = {}
                if district_name not in locations[province_name]:
                    locations[province_name][district_name] = set()
                locations[province_name][district_name].add(ward_name)

            formatted_locations = {
                province: {
                    district: list(wards) for district, wards in districts.items()
                }
                for province, districts in locations.items()
            }

            return formatted_locations
        except Exception as e:
            print(f"Error getting valid wards: {e}")
            return {}
        finally:
            db.close()

