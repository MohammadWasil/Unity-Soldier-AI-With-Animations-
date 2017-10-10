#pragma strict
import UnityEngine.Audio ;

@System.Serializable
public class Sound
{
	var name : String ;
	var clip : AudioClip ;
	@Range(0f, 1f)
	var volume : float ;
	@Range(.1f, 3f)
	var pitch : float ;

	@HideInInspector
	public var source : AudioSource ;

	function Start () 
	{
	
	}

	function Update () 
	{
	
	}

}