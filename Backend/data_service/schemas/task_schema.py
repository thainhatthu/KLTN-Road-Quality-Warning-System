from datetime import date, datetime
from typing import Tuple
from Database import Postgresql
from pydantic import BaseModel
import json

class Task(BaseModel):
    username: str
    province_name: str = None
    district_name: str = None
    ward_name: str = None
    deadline: datetime = None 

    def assign_task(self) -> Tuple[bool, str, str, str, str]:
        db = Postgresql()
        try:
            user_result = db.select(
                '"account"',
                'id',
                f"username = '{self.username}'"
            )
            if not user_result:
                print(f"User '{self.username}' does not exist.")
                return False, None, None, None, None
            user_id = user_result[0]

            role_result = db.select(
                '"role"',
                'permission_id',
                f"user_id = {user_id}"
            )
            if not role_result or role_result[0] != 2: 
                print(f"User not found or does not have 'technical' role.")
                return False, None, None, None, None

            user_info_result = db.select(
                '"user"',
                'fullname',
                f"user_id = {user_id}"
            )
            if not user_info_result:
                print(f"Fullname not found for user '{self.username}'.")
                return False, None, None, None, None
            fullname = user_info_result[0]

            query = f"""
                SELECT w.id, d.name, p.name
                FROM "ward" w
                JOIN "district" d ON w.district_id = d.id
                JOIN "province" p ON d.province_id = p.id
                WHERE w.name = '{self.ward_name}' AND d.name = '{self.district_name}' AND p.name = '{self.province_name}'
            """
            ward_result = db.execute(query, fetch='one')

            if not ward_result:
                print(f"Ward '{self.ward_name}' does not exist.")
                return False, None, None, None, None

            ward_id, district_name, province_name = ward_result

            formatted_deadline = self.deadline.strftime('%Y-%m-%d %H:%M:%S')
            db.insert(
                '"assignment"',
                'user_id, ward_id, deadline',
                f"{user_id}, {ward_id}, '{formatted_deadline}'"
            )
            db.commit()

            print(f"Task assigned to {self.username} successfully.")
            return True, fullname, district_name, province_name
        except Exception as e:
            print(f"Error assigning task: {e}")
            return False, None, None, None, None
        finally:
            db.close()

    def get_task(self, role: str, user_id: int = None) -> list:
        db = Postgresql()
        try:
            query = f'''
                SELECT s.id, s.deadline, s.status, w.name, d.name, p.name, w.id, d.id, p.id
                FROM "assignment" s
                JOIN "ward" w ON s.ward_id = w.id
                JOIN "district" d ON w.district_id = d.id
                JOIN "province" p ON d.province_id = p.id
                JOIN "account" a ON s.user_id = a.id
            '''
            
            if role == "admin" and user_id is not None:
                query += f"WHERE s.user_id = {user_id}"
            else:
                query += f"WHERE s.user_id = (SELECT id FROM account WHERE username = '{self.username}')"

            task_results = db.execute(query, fetch='all')

            tasks = []
            for row in task_results:
                road_done_query = f'''
                    SELECT COUNT(*)
                    FROM "road"
                    WHERE ward_id = {row[6]} AND status = 'Done'
                '''
                road_count = db.execute(road_done_query, fetch='one')[0]

                all_road_query = f'''
                    SELECT COUNT(*)
                    FROM "road"
                    WHERE ward_id = {row[6]}
                '''
                all_road_count = db.execute(all_road_query, fetch='one')[0]

                deadline = row[1].strftime('%Y-%m-%d %H:%M:%S') if isinstance(row[1], datetime) else None
                location = f"{row[3]}, {row[4]}, {row[5]}"

                tasks.append({
                    "task_id": row[0],
                    "deadline": deadline,
                    "status": row[2],
                    "location": location,
                    "ward_id": row[6],
                    "district_id": row[7],
                    "province_id": row[8],
                    "road_done": road_count,
                    "all_road": all_road_count
                })

            return tasks
        except Exception as e:
            print(f"Error getting tasks: {e}")
            return []
        finally:
            db.close()

    def delete_task(self, task_id: int) -> bool:
        db = Postgresql()
        try:
            db.execute(
                f'DELETE FROM "assignment" WHERE id = {task_id}',
                fetch=None
            )
            db.commit()
            print(f"Task with id '{task_id}' deleted successfully.")
            return True
        except Exception as e:
            print(f"Error deleting task: {e}")
            return False
        finally:
            db.close()

    def update_status(self, status: str, road_id: int = None, ward_id: int = None,report=None) -> bool:
        db = Postgresql()
        try:
            user_result = db.select(
                '"account"',
                'id',
                f"username = '{self.username}'"
            )
            if not user_result:
                print(f"User '{self.username}' does not exist.")
                return False
            user_id_from_db = user_result[0]

            role_result = db.select(
                '"role"',
                'permission_id',
                f"user_id = {user_id_from_db}"
            )
            if not role_result:
                print(f"User '{self.username}' has no role assigned.")
                return False
            user_role = role_result[0]

            if ward_id:
                if user_role != 1:  
                    print(f"User '{self.username}' is not an admin.")
                    return False

                assignment_result = db.select(
                    '"assignment"',
                    'id',
                    f"ward_id = {ward_id}"
                )
                if not assignment_result:
                    print(f"No assignment found.")
                    return False

                updated_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                db.update(
                    '"assignment"',
                    f"status = '{status}', updated_at = '{updated_at}'",
                    f"ward_id = {ward_id}"
                )
                db.commit()
                print(f"Assignment status updated successfully.")
                return True

            if road_id:
                if user_role not in [1, 2]:  
                    print(f"User '{self.username}' is not authorized to update road status.")
                    return False

                updated_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                if status == 'Done':
                    db.update(
                        '"road"',
                        f"status = '{status}', update_at = '{updated_at}', level = 'Good'",
                        f"id = {road_id}"
                    )
                else:
                    db.update(
                        '"road"',
                        f"status = '{status}', update_at = '{updated_at}'",
                        f"id = {road_id}"
                    )
                if report:
                    report = json.dumps(report.dict())
                    db.update(
                        '"road"',
                        f"report = '{report}'",
                        f"id = {road_id}"
                    )

                db.commit()
                print(f"Road status updated to '{status}' for road_id '{road_id}' successfully.")
                return True


            print("Invalid parameters for updating status.")
            return False
        except Exception as e:
            print(f"Error updating status: {e}")
            return False
        finally:
            db.close()

    def get_report_task(self, road_id: int) -> list:
        db = Postgresql()
        try:
            query = f'''
                SELECT report
                FROM road r
                WHERE id = {road_id}
            '''
            report_results = db.execute(query, fetch='all')

            return report_results
        except Exception as e:
            print(f"Error getting reports: {e}")
            return ""
        finally:
            db.close()
