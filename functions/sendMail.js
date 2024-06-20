import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "productpricetrckr@gmail.com",
        pass: "bnos npgq zugc bqel",
    },
});
const emailTemp = (imageURL, currentPrice, previousPrice, priceDiff, title) => `<!DOCTYPE html>
<html>
    <style>
        .body {
            margin: 20px;
        }
        .product-title {
            font-size: 25px;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        }
        .info {
            display: flex;
        }
        .info-table {
            min-width: 100% !important;
        }
        .price {
            font-size: 30px;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        }
        .heading {
            font-size: 25px;
            font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif
        }
        .features-heading {
            font-size: 30px;
        }
    </style>
    <body>
        <div class="body">
            <div class="info">
            <div>
            <img src="cid:${imageURL}"/>
            </div>
            <h3 class="product-title">${title}</h3>
                <div>
                    <table class="info-table" style="width: 100%;">
                        <tr>
                            <td>
                                <div>
                                    <h3 class="heading">Previous Price</h3>
                                    <h4 class="price">${previousPrice}</h4>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <h3 class="heading">Current Price</h3>
                                    <h4 class="price">${currentPrice}</h4>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <h3 class="heading">Price Change</h3>
                                    <h4 id="priceChange" class="price">${priceDiff}</h4>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>`;
export async function SendMail(imageURL, currentPrice, previousPrice, priceDiff, productTitle, productID, userEmail) {
    if(!userEmail) return;
    await transporter.sendMail({
        from: "Price Tracker extension",
        to: userEmail,
        subject: "Product Price changed",
        text: "Price changed",
        html: emailTemp(imageURL, currentPrice, previousPrice, priceDiff, productTitle),
        attachments: [{
            filename: 'product_img.jpg',
            path: imageURL,
            cid: imageURL
        }]
    }).then(res => {
        const recipent = res.envelope.to[0]
        console.log(`Mailed to ${recipent} for ID ${productID}`)
    }).catch(err => console.log(err.message))
}