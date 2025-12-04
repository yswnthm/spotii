const vertexShader = `
varying vec2 vUv;

attribute vec3 aInitialPosition;
attribute float aMeshSpeed;
attribute vec4 aTextureCoords;


uniform float uTime;
uniform vec2 uMaxXdisplacement;
uniform vec2 uDrag;

uniform float uSpeedY;
uniform float uScrollY;


varying float vVisibility;
varying vec4 vTextureCoords;


//linear smoothstep
float remap(float value, float originMin, float originMax)
{
    return clamp((value - originMin) / (originMax - originMin),0.,1.);
}

void main()
{     
    
    vec3 newPosition=position + aInitialPosition;


    float maxX = uMaxXdisplacement.x;
    float maxY = uMaxXdisplacement.y;

    float maxYoffset = distance(aInitialPosition.y,maxY);
    float minYoffset = distance(aInitialPosition.y,-maxY);

    
    float maxXoffset = distance(aInitialPosition.x,maxX);
    float minXoffset = distance(aInitialPosition.x,-maxX);
    
    
    float xDisplacement = mod(minXoffset -uDrag.x + uTime * aMeshSpeed, maxXoffset+minXoffset) - minXoffset;
    float yDisplacement = mod(minYoffset -uDrag.y, maxYoffset+minYoffset) - minYoffset;

    
    float maxZ = 12.;
    float minZ = -30.;
    
    float maxZoffset = distance(aInitialPosition.z,maxZ);    
    float minZoffset = distance(aInitialPosition.z,minZ);    
    
    float zDisplacement = mod(uScrollY + minZoffset,maxZoffset + minZoffset ) - minZoffset;    
    
    newPosition.x += xDisplacement; 
    newPosition.y += yDisplacement;
    newPosition.z += zDisplacement;


    vVisibility = remap(newPosition.z, minZ, minZ+5.);
    


    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(newPosition, 1.0);        


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;    

    vUv = uv;
    vTextureCoords = aTextureCoords;
}
`

export default vertexShader
