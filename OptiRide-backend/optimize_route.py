from ortools.constraint_solver import pywrapcp, routing_enums_pb2

# Define location labels matching your OptiRide concept
LOCATIONS = [
    "Driver Start",       # 0
    "Grocery Store",      # 1
    "Customer Delivery",  # 2
    "Passenger Pickup",   # 3
    "Passenger Drop"      # 4
]

# Distance Matrix (mock realistic distances in minutes or km)
#      0    1    2    3    4
distance_matrix = [
    [0,   4,   7,   5,   9],   # From Driver Start
    [4,   0,   3,   6,   8],   # From Grocery Store
    [7,   3,   0,   4,   7],   # From Customer Delivery
    [5,   6,   4,   0,   5],   # From Passenger Pickup
    [9,   8,   7,   5,   0]    # From Passenger Drop
]

def print_solution(manager, routing, solution):
    index = routing.Start(0)
    plan_output = []
    total_distance = 0

    while not routing.IsEnd(index):
        node = manager.IndexToNode(index)
        plan_output.append(LOCATIONS[node])
        previous_index = index
        index = solution.Value(routing.NextVar(index))

        if not routing.IsEnd(index):
            total_distance += routing.GetArcCostForVehicle(previous_index, index, 0)

    print("\n🚀 OPTIMIZED ROUTE (Ride + Delivery Merged):")
    for step in plan_output:
        print(" → ", step)
    print(f"\nTotal Distance (Mock): {total_distance} units\n")

def main():
    manager = pywrapcp.RoutingIndexManager(
        len(distance_matrix), 
        1,      # one driver/bike
        0       # starting at Driver Start (index 0)
    )

    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_idx, to_idx):
        from_node = manager.IndexToNode(from_idx)
        to_node = manager.IndexToNode(to_idx)
        return distance_matrix[from_node][to_node]

    transit_callback = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback)

    search_params = pywrapcp.DefaultRoutingSearchParameters()
    search_params.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )

    solution = routing.SolveWithParameters(search_params)

    if solution:
        print_solution(manager, routing, solution)
    else:
        print("No solution found.")

if __name__ == "__main__":
    main()
