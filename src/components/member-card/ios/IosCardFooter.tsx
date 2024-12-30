interface IosCardFooterProps {
  publicCardUrl: string;
}

export const IosCardFooter = ({ publicCardUrl }: IosCardFooterProps) => {
  return (
    <div className="text-center text-sm text-gray-500 mt-4">
      URL publique du QR code : {' '}
      <a 
        href={publicCardUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        {publicCardUrl}
      </a>
    </div>
  );
};