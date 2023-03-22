import React, { useRef, useEffect, useState } from 'react'
import '../../resources/css/characters_threeLittlePigs.css'
import { imagesURL_animation } from '../../index'
function Animation([...character]) {
  const images = imagesURL_animation
  let characters = []
  character.map(item => {
    let characterbody
    switch (item.emotion) {
      case 'curlyNormal':
        characterbody = [
          <img src={images['curlyNormalBody']} className='curly_normal_body' />,
          <img src={images['curlyNormalMouth1']} className='curly_normal_mouth1' />,
          <img src={images['curlyNormalMouth2']} className='curly_normal_mouth2' />,
          <img src={images['curlyNormalEye']} className='curly_normal_eye' />
        ]
        break
      case 'chunkyNormal':
        characterbody = [
          <img src={images['chunkyNormalBody']} className='chunky_normal_body' />,
          <img src={images['chunkyNormalMouth1']} className='chunky_normal_mouth1' />,
          <img src={images['chunkyNormalMouth2']} className='chunky_normal_mouth2' />,
          <img src={images['chunkyNormalEye']} className='chunky_normal_eye' />
        ]
        break
      case 'pinkyNormal':
        characterbody = [
          <img src={images['pinkyNormalBody']} className='pinky_normal_body' />,
          <img src={images['pinkyNormalMouth1']} className='pinky_normal_mouth1' />,
          <img src={images['pinkyNormalMouth2']} className='pinky_normal_mouth2' />,
          <img src={images['pinkyNormalEye']} className='pinky_normal_eye' />
        ]
        break
      case 'mamaNormal':
        characterbody = [
          //                -file name-                  -css name-
          <img src={images['mamaNormalBody']} className='mama_normal_body' />,
          <img src={images['mamaNormalMouth1']} className='mama_normal_mouth1' />,
          <img src={images['mamaNormalMouth2']} className='mama_normal_mouth2' />,
          <img src={images['mamaNormalEye']} className='mama_normal_eye' />
        ]
        break
      case 'curlyWorried':
        characterbody = [
          <img src={images['curlyWorriedBody']} className='curly_worried_body' />,
          <img src={images['curlyWorriedMouth1']} className='curly_worried_mouth1' />,
          <img src={images['curlyWorriedMouth2']} className='curly_worried_mouth2' />,
          <img src={images['curlyWorriedEye']} className='curly_worried_eye' />,
          <img src={images['curlyWorriedSweat1']} className='curly_worried_sweat1' />,
          <img src={images['curlyWorriedSweat2']} className='curly_worried_sweat2' />
        ]
        break
      case 'chunkyWorried':
        characterbody = [
          <img src={images['chunkyWorriedBody']} className='chunky_worried_body' />,
          <img src={images['chunkyWorriedMouth1']} className='chunky_worried_mouth1' />,
          <img src={images['chunkyWorriedMouth2']} className='chunky_worried_mouth2' />,
          <img src={images['chunkyWorriedEye']} className='chunky_worried_eye' />,
          <img src={images['chunkyWorriedSweat1']} className='chunky_worried_sweat1' />,
          <img src={images['chunkyWorriedSweat2']} className='chunky_worried_sweat2' />
        ]
        break
      case 'pinkyWorried':
        characterbody = [
          <img src={images['pinkyWorriedBody']} className='pinky_worried_body' />,
          <img src={images['pinkyWorriedMouth1']} className='pinky_worried_mouth1' />,
          <img src={images['pinkyWorriedMouth2']} className='pinky_worried_mouth2' />,
          <img src={images['pinkyWorriedEye']} className='pinky_worried_eye' />,
          <img src={images['pinkyWorriedSweat1']} className='pinky_worried_sweat1' />,
          <img src={images['pinkyWorriedSweat2']} className='pinky_worried_sweat2' />
        ]
        break
      case 'mamaWorried':
        characterbody = [
          <img src={images['mamaWorriedBody']} className='mama_worried_body' />,
          <img src={images['mamaWorriedMouth1']} className='mama_worried_mouth1' />,
          <img src={images['mamaWorriedMouth2']} className='mama_worried_mouth2' />,
          <img src={images['mamaWorriedEye']} className='mama_worried_eye' />,
          <img src={images['mamaWorriedSweat1']} className='mama_worried_sweat1' />,
          <img src={images['mamaWorriedSweat2']} className='mama_worried_sweat2' />
        ]
        break
      case 'beaverNormal':
        characterbody = [
          <img src={images['beaverBody']} className='beaver_body' />,
          <img src={images['beaverEye']} className='beaver_eye' />
        ]
        break
      case 'horseNormal':
        characterbody = [
          <img src={images['horseBody']} className='horse_body' />,
          <img src={images['horseEye']} className='horse_eye' />,
          <img src={images['horseTail']} className='horse_tail' />
        ]
        break
      case 'goatNormal':
        characterbody = [
          <img src={images['goatBody']} className='goat_body' />,
          <img src={images['goatEye']} className='goat_eye' />
        ]
        break
      case 'robotNormal':
        characterbody = [
          <img src={images['robotBody']} className='robot_body' />,
          <img src={images['robotEye']} className='robot_eye' />
        ]
        break
      case 'willisNormal':
        characterbody = [
          <img src={images['wolfNormalBody']} className='wolf_normal_body' />,
          <img src={images['wolfNormalEye']} className='wolf_normal_eye' />,
          <img src={images['wolfNormalMouth1']} className='wolf_normal_mouth1' />,
          <img src={images['wolfNormalMouth2']} className='wolf_normal_mouth2' />
        ]
        break
      case 'willisWorried':
        characterbody = [
          <img src={images['wolfWorriedBody']} className='wolf_worried_body' />,
          <img src={images['wolfWorriedEye']} className='wolf_worried_eye' />,
          <img src={images['wolfWorriedSweat1']} className='wolf_worried_sweat1' />,
          <img src={images['wolfWorriedSweat2']} className='wolf_worried_sweat2' />
        ]
        break
      case 'willisBlow':
        characterbody = [
          <img src={images['wolfBlowBody']} className='wolf_blow_body' />,
          <img src={images['wolfBlowEye']} className='wolf_blow_eye' />,
          <img src={images['wolfBlowMouth']} className='wolf_blow_mouth' />,
          <img src={images['wolfBlowIcon']} className='wolf_blow_icon' />
        ]
        break
      case 'willisHungry':
        characterbody = [
          <img src={images['wolfHungryBody']} className='wolf_hungry_body' />,
          <img src={images['wolfHungryEye']} className='wolf_hungry_eye' />,
          <img src={images['wolfHungryMouth1']} className='wolf_hungry_mouth1' />,
          <img src={images['wolfHungryMouth2']} className='wolf_hungry_mouth2' />
        ]
        break
      default:
        break
    }
    characters.push(
      <div class='App-story' id={item.emotion} style={{
        left: item.left,
        top: item.top,
        width: item.width,
        height: item.height,
        opacity: 1,
        position: 'absolute',
        zIndex: 1
      }}>
        {characterbody}
      </div>
    )
  })
  return characters
}

export default Animation
