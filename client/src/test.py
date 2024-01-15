def find_min_forces(areas, N, W):
    min_forces = float('inf')
    for i in range(N):
        total = 0
        for j in range(i, i + N):
            total += areas[j]
            if total > W:
                break
        if total <= W:
            min_forces = min(min_forces, N - i)
    return min_forces


T = int(input())

for _ in range(T):
    N, W = map(int, input().split())
    areas = list(map(int, input().split()))
    areas += list(map(int, input().split()))  # 입력에서 구역의 적 수를 2번 받아야 함

    min_forces = find_min_forces(areas, N, W)

    print(min_forces)
