export default function ProfilePage({ params }) {
  return <div>Profile {params.address}</div>;
}

function ProfileHeader() {
  return <header>Header</header>;
}

function NFTGallery() {
  return <div className="gallery">NFTs</div>;
}

