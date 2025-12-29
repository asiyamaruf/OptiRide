# helpers.py
import math
from ortools.constraint_solver import pywrapcp, routing_enums_pb2

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000  # meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return int(R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)))

def build_distance_matrix(locations):
    size = len(locations)
    matrix = [[0] * size for _ in range(size)]

    for i in range(size):
        for j in range(size):
            if i != j:
                matrix[i][j] = haversine(
                    locations[i][0], locations[i][1],
                    locations[j][0], locations[j][1]
                )
    return matrix

def solve_vrp(distance_matrix, num_vehicles):
    manager = pywrapcp.RoutingIndexManager(
        len(distance_matrix),
        num_vehicles,
        0  # depot index
    )
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return distance_matrix[from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    search_params = pywrapcp.DefaultRoutingSearchParameters()
    search_params.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )

    solution = routing.SolveWithParameters(search_params)
    if not solution:
        return None

    routes = []
    for vehicle_id in range(num_vehicles):
        index = routing.Start(vehicle_id)
        route = []
        while not routing.IsEnd(index):
            route.append(manager.IndexToNode(index))
            index = solution.Value(routing.NextVar(index))
        routes.append(route)

    return routes
