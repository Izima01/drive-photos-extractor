/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import '../App.css';
import { Image } from 'antd';
import { folderArray } from '../data';

const DrivePhotos = () => {
  const googlePwrd = 'AIzaSyCeJX8wcU68_qWmn6Tp6Rpdtav7yDxiUG4';
  const [files, setFiles] = useState([]);

  const extractFolderId = (url) => {
    const regex = /\/folders\/([^/?]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const fetchFilesFromAFolder = async (folderId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&key=${googlePwrd}&fields=files(id,name,thumbnailLink,webContentLink)&pageSize=10`
      );
      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error(`Error fetching images from folder ${folderId}`, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllFolders = async () => {
      let allImages = [];
      for (const folder of folderArray) {
        const response = await fetchFilesFromAFolder(
          extractFolderId(folder.link)
        );
        allImages = [...allImages, { name: folder.name, images: response }];
      }
      setFiles(allImages);
    };

    fetchAllFolders();
  }, []);

  return (
    <div>
      <h1>Drive API Quickstart</h1>
      {files.length > 0 ? (
        <div className='image-gallery'>
          {files.map((folder) => (
            <div key={folder.name}>
              <Image.PreviewGroup
                items={[...folder.images.map((el) => el.thumbnailLink)]}
              >
                <Image
                  // width={200}
                  title={folder.name}
                  src={folder.images[0].thumbnailLink.replace('=s220', '')}
                  height={180}
                />
              </Image.PreviewGroup>
              <p>
                <strong>Folder:</strong> {folder.name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <h3>No files found.</h3>
      )}
    </div>
  );
};

export default DrivePhotos;
