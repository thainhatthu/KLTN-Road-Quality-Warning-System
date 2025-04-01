import numpy as np
from sklearn.cluster import DBSCAN
from Database import Postgresql,MongoDB
import os
import inspect
from fastapi.responses import JSONResponse
current_file_path = os.path.abspath(__file__)


class RouteMap():
    def __init__(self, areas):
        self.areas=areas
        self.coordinates=[]
        self.final_routes = {}
        self.getCoor()
        self.apply_dbscan()
        
    def getCoor(self):
        try:
            for area in self.areas:
                postgres=Postgresql()
                data=postgres.execute(f"SELECT latitude,longitude FROM road WHERE ward_id={area} and level <> 'Good' and level <> 'Classifing'",fetch='all')
                postgres.close()
                self.coordinates.append(data)
        except Exception as e:
            print(current_file_path, e)
    
    def apply_dbscan(self):
        try:
            for i in range(len(self.coordinates)):
                coords_np = np.array(self.coordinates[i])
                if len(coords_np) <= 1: 
                    mongo=MongoDB()
                    mongo.update('route_map', {'_id': self.areas[i]},{'$set': {'routes': {}}})
                    continue
                coords_np =np.unique(coords_np, axis=0)
                db = DBSCAN(eps=0.00045, min_samples=2).fit(coords_np)
                labels = db.labels_
                routes = {}
                for label, coord in zip(labels, coords_np.tolist()):
                    if label not in routes:
                        routes[label] = []
                    routes[label].append(str(tuple(coord)))
                routes = {label: route for label, route in routes.items() if label != -1}
                routes={str(key): value for key, value in routes.items()}
                mongo=MongoDB()
                mongo.update('route_map', {'_id': self.areas[i]},{'$set': {'routes': routes}})
        except Exception as e:
            print(current_file_path,inspect.currentframe().f_code.co_name, e)
    @staticmethod
    def get_route_map():
        try:
            mongo=MongoDB()
            data=mongo.find('route_map',{'routes': {'$ne': {}}}, protections={'_id': 0, 'routes': 1})
            data = list(data)
            all_routes = []
            for document in data:
                # Duyệt qua tất cả các key trong 'routes' và gộp tất cả các tuyến vào all_routes
                for route_key, route in document['routes'].items():
                    all_routes.append(route)  # Thêm các điểm tọa độ vào all_routes
            return JSONResponse(content={'satus': 'Success','message':'Get route succesful','data': all_routes}, status_code=200)
        except Exception as e:
            print(current_file_path,inspect.currentframe().f_code.co_name, e)
            return {}