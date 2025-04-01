import psycopg2
import os


class Postgresql:
    def __init__(self):
        self.connection_params={
            'dbname': os.getenv('POSTGRESQL_DB'),
            'user': os.getenv('POSTGRESQL_USER'),
            'password': os.getenv('POSTGRESQL_PASSWORD'),
            'host': os.getenv('POSTGRESQL_HOST'),
            'port': os.getenv('POSTGRESQL_PORT')
        }
        self.connection = psycopg2.connect(**self.connection_params)
        self.cursor = self.connection.cursor()

    def select(self, table, columns='*', where=None):
        query = f"SELECT {columns} FROM {table}"
        if where:
            query += f" WHERE {where}"
        return self.execute(query)
    
    def insert(self, table, columns, values):
        query = f"INSERT INTO {table} ({columns}) VALUES ({values})"
        return self.execute(query,'false')
    
    def update(self, table, set, where):
        query = f"UPDATE {table} SET {set} WHERE {where}"
        return self.execute(query,'false')
    
    def delete(self, table, where):
        query = f"DELETE FROM {table} WHERE {where}"
        return self.execute(query)
    
    def execute(self, query, fetch='one'):
        self.cursor.execute(query)
        if fetch == 'one':
            return self.cursor.fetchone()
        elif fetch == 'all':
            return self.cursor.fetchall()
        else:
            return self.cursor
    def commit(self):
        self.connection.commit()

    def close(self):
        self.cursor.close()
        self.connection.close()