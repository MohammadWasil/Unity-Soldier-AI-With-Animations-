using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI ;

public class NavMeshSample : MonoBehaviour {

	NavMeshSurface surface ;

	// Use this for initialization
	void Start () {
		surface = GetComponent<NavMeshSurface> ();
		surface.Bake ();
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
