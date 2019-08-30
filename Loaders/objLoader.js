/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.OBJLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

	this.materials = null;

};

THREE.OBJLoader.prototype = {

	constructor: THREE.OBJLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setPath( this.path );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( text ) );

		}, onProgress, onError );

	},

	setPath: function ( value ) {

		this.path = value;

	},

	setMaterials: function ( materials ) {

		this.materials = materials;

	},

	parse: function ( text ) {
		var objects = [];
        var object = {};
		var foundObjects = false;
        var vertices = [];
		var normals = [];
        var uvs = [];
        var v = [];
        var t = [];
        var minVertex = new THREE.Vector3();
        var maxVertex = new THREE.Vector3();
        var firstVertex = true;
        var temp3D;

		// v float float float
		var vertex_pattern = /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;

		// vn float float float
		var normal_pattern = /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;

		// vt float float
		var uv_pattern = /^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;

        /*
		// f vertex vertex vertex ...
		var face_pattern1 = /^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/;

		// f vertex/uv vertex/uv vertex/uv ...
		var face_pattern2 = /^f\s+((-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+))(?:\s+((-?\d+)\/(-?\d+)))?/;

		// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
		var face_pattern3 = /^f\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))(?:\s+((-?\d+)\/(-?\d+)\/(-?\d+)))?/;

		// f vertex//normal vertex//normal vertex//normal ...
		var face_pattern4 = /^f\s+((-?\d+)\/\/(-?\d+))\s+((-?\d+)\/\/(-?\d+))\s+((-?\d+)\/\/(-?\d+))(?:\s+((-?\d+)\/\/(-?\d+)))?/;
            */

        var face_pattern = /^f\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))(?:\s+((-?\d+)\/(-?\d+)\/(-?\d+)))?/;

		var object_pattern = /^[og]\s+(.+)/;

		var smoothing_pattern = /^s\s+([01]|on|off)/;

		//

        var lines = text.split( '\n' );

		for ( var i = 0; i < lines.length; i ++ ) {

			var line = lines[ i ];
			line = line.trim();

			var result;

			if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

				continue;

			} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

				// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
                temp3D = new THREE.Vector3(parseFloat(result[1]), parseFloat(
                    result[2]), parseFloat(result[3]));
                v.push(temp3D);
                if (firstVertex) {
                    minVertex = temp3D.clone();
                    maxVertex = temp3D.clone();
                    firstVertex = false;
                } else {
                    if (temp3D.x < minVertex.x) {
                        minVertex.setX(temp3D.x);
                    }
                    if (temp3D.y < minVertex.y) {
                        minVertex.setY(temp3D.y);
                    }
                    if (temp3D.z < minVertex.z) {
                        minVertex.setZ(temp3D.z);
                    }
                    if (temp3D.x > maxVertex.x) {
                        maxVertex.setX(temp3D.x);
                    }
                    if (temp3D.y > maxVertex.y) {
                        maxVertex.setY(temp3D.y);
                    }
                    if (temp3D.z > maxVertex.z) {
                        maxVertex.setZ(temp3D.z);
                    }
                }

			} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

				// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

				normals.push(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] ),
					parseFloat( result[ 3 ] )
				);

			} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

				// ["vt 0.1 0.2", "0.1", "0.2"]

                t.push(new THREE.Vector2(parseFloat(result[1]),
                                           1.0 - parseFloat(result[2])));

            } else if ( ( result = face_pattern.exec( line ) ) !== null ) {

				// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

                vertices.push(v[result[2] - 1]);
                uvs.push(t[result[3] - 1]);
                vertices.push(v[result[6] - 1]);
                uvs.push(t[result[7] - 1]);
                vertices.push(v[result[10] - 1]);
                uvs.push(t[result[11] - 1]);
                if (result[14]) {
                    vertices.push(v[result[2] - 1]);
                    uvs.push(t[result[3] - 1]);
                    vertices.push(v[result[10] - 1]);
                    uvs.push(t[result[11] - 1]);
                    vertices.push(v[result[14] - 1]);
                    uvs.push(t[result[15] - 1]);
                }
            }
		}

        /*
		var container = new THREE.Group();

		for ( var i = 0, l = objects.length; i < l; i ++ ) {

			object = objects[ i ];
			var geometry = object.geometry;

			var buffergeometry = new THREE.BufferGeometry();

			buffergeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( geometry.vertices ), 3 ) );

			if ( geometry.normals.length > 0 ) {

				buffergeometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( geometry.normals ), 3 ) );

			} else {

				buffergeometry.computeVertexNormals();

			}

			if ( geometry.uvs.length > 0 ) {

				buffergeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( geometry.uvs ), 2 ) );

			}

			var material;

			if ( this.materials !== null ) {

				material = this.materials.create( object.material.name );

			}

			if ( !material ) {

				material = new THREE.MeshPhongMaterial();
				material.name = object.material.name;

			}

			material.shading = object.material.smooth ? THREE.SmoothShading : THREE.FlatShading;

			var mesh = new THREE.Mesh( buffergeometry, material );
			mesh.name = object.name;

			container.add( mesh );

		}
        */
        object.vertices = vertices;
        object.uvs = uvs;
        object.minVertex = minVertex;
        object.maxVertex = maxVertex;
        object.center = new THREE.Vector3(((maxVertex.x - minVertex.x) / 2) +
            minVertex.x, ((maxVertex.y - minVertex.y) / 2) + minVertex.y, ((
            maxVertex.z - minVertex.z) / 2) + minVertex.z);
        object.w = maxVertex.x - minVertex.x;
        object.h = maxVertex.y - minVertex.y;
        object.d = maxVertex.z - minVertex.z;

        return object;

	}

};
