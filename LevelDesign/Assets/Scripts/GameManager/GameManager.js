#pragma strict
import System.Collections.Generic ;

public var enemys = new List.<Enemy>() ;


function Start () 
{

}

function Update () 
{
	var i : int ;
	for( i = 0 ; i < enemys.Count ; i++)
	{
		if(enemys[i].health <= 0)
		{
			enemys.RemoveAt(i) ;
			if(enemys.Count == 0)
			{
				Debug.Log("you won!") ;
			}
		}
	}



}