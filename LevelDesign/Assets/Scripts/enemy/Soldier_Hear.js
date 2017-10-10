#pragma strict

public var hero : GameObject ;

private var soldier : Soldier ;
private var col : SphereCollider ;
private var nav : NavMeshAgent ;

function Start () 
{
	hero = GameObject.Find("FPSController" ) ;
	col = GetComponent.<SphereCollider>() ;	
	nav = GetComponent.<NavMeshAgent>() ;
	soldier = GetComponent.<Soldier>() ;
}

function Update () {
	
}

function OnTriggerStay(other : Collider)
{
	if(other.gameObject == hero)
	{
		if(CalculatePathLength(hero.transform.position) <= col.radius)
		{
			soldier.Sight() ;
		}
	}
}

function CalculatePathLength(targetPosition : Vector3) : float
{
	var path : NavMeshPath = new NavMeshPath() ;

	if(nav.enabled)
		nav.CalculatePath(targetPosition, path) ;

	var wayPoints : Vector3[] = new Vector3[path.corners.Length + 2] ;

	wayPoints[0] = transform.position ;
	wayPoints[wayPoints.Length-1] = targetPosition ;

	for(var i : int = 0 ; i < path.corners.Length ; i++)
	{
		wayPoints[i+1] = path.corners[i] ;
	}

	var pathLength : float = 0f ;

	for(var j : int = 0 ; j < wayPoints.Length-1 ; j++)
	{
		pathLength += Vector3.Distance(wayPoints[j], wayPoints[j+1]) ;
	}
	return pathLength ;
}